"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function apply_micro_page_template(title, content, base_url = '') {
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
	`;
}
exports.apply_micro_page_template = apply_micro_page_template;
function serve_micro_page(title, content) {
    return function (req, res) {
        res.type('html').send(apply_micro_page_template(title, content, req.baseUrl));
    };
}
exports.serve_micro_page = serve_micro_page;
//# sourceMappingURL=micro-page.js.map