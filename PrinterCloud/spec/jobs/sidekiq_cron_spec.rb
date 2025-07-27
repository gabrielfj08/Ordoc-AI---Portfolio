require 'rails_helper'
require 'fugit'

RSpec.describe 'sidekiq-cron' do
  schedule_file = File.join(Rails.root, 'config', 'schedule.yml')
  schedule = YAML.load_file(schedule_file)

  describe 'cron syntax' do
    schedule.each do |key, value|
      cron = value['cron']
      it "#{key} has correct cron syntax" do
        expect { Fugit.do_parse(cron) }.not_to raise_error
      end
    end
  end

  describe 'job classes' do
    schedule.each do |key, value|
      job_class = value['class']
      it "#{key} has #{job_class} class in /jobs" do
        expect { job_class.constantize }.not_to raise_error
      end
    end
  end

  describe 'job queue' do
    schedule.each do |key, value|
      queue = value['queue']
      it "#{key} has #{queue} class in /jobs" do
        expect(queue).to eq(queue)
      end
    end
  end
end
