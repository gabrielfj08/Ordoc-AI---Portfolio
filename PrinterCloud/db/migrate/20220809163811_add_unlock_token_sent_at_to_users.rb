  class AddUnlockTokenSentAtToUsers < ActiveRecord::Migration[6.1]
    def change
      change_table :users do |t|
        t.datetime :unlock_token_sent_at
      end
    end
  end
