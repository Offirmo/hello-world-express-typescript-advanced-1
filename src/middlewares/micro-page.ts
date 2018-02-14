import express = require('express')

/////////////////////////////////////////////

function serve_micro_page(title: string, content: string): express.RequestHandler {
	return function(req: express.Request, res: express.Response): void {
		res.send(`
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
		el.href || (el.href = "${req.baseUrl}" + el.text);
	});
</script>
	`)
	}
}

/////////////////////////////////////////////

export {
	serve_micro_page,
}
