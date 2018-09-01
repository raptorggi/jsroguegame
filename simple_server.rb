require 'sinatra/base'
require 'sprockets'
require 'sprockets-helpers'
require 'uglifier'
require 'sass'
require 'coffee-script'
require 'execjs'

class SimpleServer < Sinatra::Base
  set :sessions, false
  set :root, File.dirname(__FILE__)
  set :public_folder, "#{File.dirname(__FILE__)}/public"

  set :sprockets, Sprockets::Environment.new(root)
  set :assets_prefix, '/assets'
  set :digest_assets, false


  helpers do
    include Sprockets::Helpers
  end

  configure do

    sprockets.append_path File.join(root, 'assets', 'stylesheets')
    sprockets.append_path File.join(root, 'assets', 'javascripts')
    sprockets.append_path File.join(root, 'assets', 'images')

    Sprockets::Helpers.configure do |config|
      config.environment = sprockets
      config.prefix      = assets_prefix
      config.digest      = digest_assets
      config.public_path = public_folder

      # Force to debug mode in development mode
      # Debug mode automatically sets
      # expand = true, digest = false, manifest = false
      config.debug       = true if development?
    end
  end

  get "/assets/*" do
    env["PATH_INFO"].sub!("/assets", "")
    settings.sprockets.call(env)
  end

  get '/' do
    erb :index, :layout => :layout
  end

  
end