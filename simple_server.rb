require 'sinatra' # http://localhost:4567

set :public_folder, File.dirname(__FILE__) + '/static'

get '/' do
  erb :index, :layout => :layout
end