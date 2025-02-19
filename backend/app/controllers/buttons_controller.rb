class ButtonsController < ApplicationController

  def index
    @buttons = Button.all

    render json: @buttons
  end

  def show
    @button = Button.find(params[:id])
    render json: @button
  end

  def create 
    @button = Button.new
    @button.count = 0
    @button.save
    render json: @button
  end

  def update
    @button = Button.find(params[:id])
    @button.count += 1
    @button.save
    render json: @button
  end

end
