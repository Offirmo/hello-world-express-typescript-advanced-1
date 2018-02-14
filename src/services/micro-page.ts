import express = require('express')

function apply_micro_page_template(title: string, content: string, base_url: string = '') {
	return `
<!DOCTYPE html>
<head>
	<title>${title}</title>
	<style type="text/css">
		body {
			margin: 33px;
			font-family: "Lucida Sans Typewriter", "Courier New", monospace;
			color: #333;
		}
	</style>
</head>

<h1>…</h1>
${content}

<script>
	document.querySelector('h1').textContent = document.title;
	Array.prototype.forEach.call(document.querySelectorAll('a'), function(el) {
		el.href || (el.href = "${base_url}" + el.text);
	});
</script>
	`
}

function serve_micro_page(title: string, content: string): express.RequestHandler {
	return function(req: express.Request, res: express.Response): void {
		res.type('html').send(apply_micro_page_template(title, content, req.baseUrl))
	}
}

export {
	apply_micro_page_template,
	serve_micro_page,
}
