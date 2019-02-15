
lint:
	find . -name '*.py' -not -path './.venv/*' | xargs flake8
clean:
	find . -name '*.pyc' -not -path './.venv/*' -delete

# vim: noexpandtab
