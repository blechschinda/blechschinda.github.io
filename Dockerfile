# Local preview image: Ruby + the same Jekyll/plugin versions GitHub Pages uses.
FROM ruby:3.3

WORKDIR /site
COPY Gemfile ./
RUN bundle install

EXPOSE 4000 35729
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--force_polling", "--livereload"]
