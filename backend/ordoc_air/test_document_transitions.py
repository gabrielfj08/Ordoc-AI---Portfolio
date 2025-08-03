import pytest
from unittest.mock import patch
from django.core.files.uploadedfile import SimpleUploadedFile
from ordoc_air import tasks
from ordoc_air.models import Document


@pytest.mark.django_db
def test_document_enqueue_schedules_task_and_records_user(django_user_model):
    user = django_user_model.objects.create(username="tester")
    doc = Document.objects.create(
        original_filename="doc.pdf",
        file=SimpleUploadedFile("doc.pdf", b"data"),
        prn="prn-1",
    )
    with patch("ordoc_air.tasks.process_document_ocr.delay") as mock_delay:
        doc.enqueue(user=user)
        doc.save()
        mock_delay.assert_called_once_with(doc.id)
    assert doc.status == "enqueued"
    assert doc.enqueued_at is not None
    assert doc.enqueued_by == user


@pytest.mark.django_db
def test_process_document_ocr_success_marks_processed():
    doc = Document.objects.create(
        original_filename="doc.pdf",
        file=SimpleUploadedFile("doc.pdf", b"data"),
        prn="prn-2",
    )
    with patch("ordoc_air.tasks.process_document_ocr.delay"):
        doc.enqueue()
        doc.save()
    with patch("ordoc_air.tasks.extract_text_from_pdf", return_value="texto"):
        tasks.process_document_ocr.run(doc.id)
    doc.refresh_from_db()
    assert doc.status == "processed"
    assert doc.processed_at is not None
    assert doc.extracted_text == "texto"


@pytest.mark.django_db
def test_process_document_ocr_failure_marks_failed():
    doc = Document.objects.create(
        original_filename="doc.pdf",
        file=SimpleUploadedFile("doc.pdf", b"data"),
        prn="prn-3",
    )
    with patch("ordoc_air.tasks.process_document_ocr.delay"):
        doc.enqueue()
        doc.save()
    with patch("ordoc_air.tasks.extract_text_from_pdf", side_effect=Exception("ocr")), \
            patch.object(tasks.process_document_ocr, "retry", side_effect=Exception("retry")):
        with pytest.raises(Exception):
            tasks.process_document_ocr.run(doc.id)
    doc.refresh_from_db()
    assert doc.status == "failed"
    assert doc.failed_at is not None


@pytest.mark.django_db
def test_index_document_in_solr_success_marks_processed():
    doc = Document.objects.create(
        original_filename="doc.pdf",
        file=SimpleUploadedFile("doc.pdf", b"data"),
        prn="prn-4",
        file_size=4,
        content_type="application/pdf",
    )
    with patch("ordoc_air.tasks.process_document_ocr.delay"):
        doc.enqueue()
        doc.save()
    with patch("ordoc_air.tasks.SolrService") as mock_solr_cls:
        mock_solr = mock_solr_cls.return_value
        tasks.index_document_in_solr.run(doc.id)
        expected_doc = {
            'id': str(doc.id),
            'extracted_text': '',
            'metadata': {
                'filename': "doc.pdf",
                'content_type': "application/pdf",
                'file_size': 4,
            }
        }
        mock_solr.add.assert_called_once_with([expected_doc])
        mock_solr.commit.assert_called_once()
    doc.refresh_from_db()
    assert doc.status == "processed"
    assert doc.processed_at is not None


@pytest.mark.django_db
def test_index_document_in_solr_failure_marks_failed():
    doc = Document.objects.create(
        original_filename="doc.pdf",
        file=SimpleUploadedFile("doc.pdf", b"data"),
        prn="prn-5",
        file_size=4,
        content_type="application/pdf",
    )
    with patch("ordoc_air.tasks.process_document_ocr.delay"):
        doc.enqueue()
        doc.save()
    with patch("ordoc_air.tasks.SolrService") as mock_solr_cls:
        mock_solr = mock_solr_cls.return_value
        mock_solr.add.side_effect = Exception("solr")
        with pytest.raises(Exception):
            tasks.index_document_in_solr.run(doc.id)
        mock_solr.commit.assert_not_called()
    doc.refresh_from_db()
    assert doc.status == "failed"
    assert doc.failed_at is not None
