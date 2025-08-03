import pytest
from unittest.mock import patch, MagicMock
from ordoc_air import tasks


@pytest.mark.django_db
def test_process_document_upload_enqueues_tasks():
    with patch("ordoc_air.tasks.batch_process_document_ocr.delay") as mock_ocr_delay, \
         patch("ordoc_air.tasks.batch_index_document_solr.delay") as mock_index_delay:
        mock_ocr_delay.return_value = MagicMock(id="ocr-id")
        mock_index_delay.return_value = MagicMock(id="index-id")

        result = tasks.process_document_upload("doc-1")

        mock_ocr_delay.assert_called_once_with("doc-1")
        mock_index_delay.assert_called_once_with("doc-1")
        assert result == {
            "document_id": "doc-1",
            "ocr_task_id": "ocr-id",
            "index_task_id": "index-id",
            "status": "queued",
        }
