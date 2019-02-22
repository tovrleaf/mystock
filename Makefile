
lint:
	find . -name '*.py' -not -path './.venv/*' | xargs flake8
clean:
	find . -name '*.pyc' -not -path './.venv/*' -delete

deploy-front:
	cd front ; npm run build ; cd build ; aws s3 sync . s3://mystock-front --delete

deploy-serverless:
	cd serverless/shares ; ../node_modules/serverless/bin/serverless deploy -s prod

# vim: noexpandtab
