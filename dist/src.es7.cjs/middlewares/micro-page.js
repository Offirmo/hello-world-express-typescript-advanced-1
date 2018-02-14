"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/////////////////////////////////////////////
function serve_micro_page(title, content) {
    return function (req, res) {
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
	`);
    };
}
exports.serve_micro_page = serve_micro_page;
//# sourceMappingURL=micro-page.js.map