require 'rails_helper'
require 'sidekiq/testing'

RSpec.describe CombinePagesWorker, type: :job do    
  describe 'combine pages worker' do
    let!(:document) { create(:document) }
    let!(:page) { create(:page, document: document) }

    it 'creates processed file attachment' do
      Sidekiq::Testing.inline! do
        CombinePagesWorker.perform_async(document.id)
      end

      expect(document.processed_file.attached?).to eq(true)
    end
  end
end
