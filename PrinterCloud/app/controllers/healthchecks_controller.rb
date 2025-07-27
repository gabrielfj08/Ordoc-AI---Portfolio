class HealthchecksController < ApplicationController
  def index
    render status: :ok, json: { status: :available }
  end
end
