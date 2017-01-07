function loadFont() {
	drawWord();
}

function drawWord() {
	const word = document.getElementById('text').value.trim();
	const renderer = document.getElementById('svg-renderer');
	renderer.innerHTML =
	`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="60">
	<text x="0" y="30">${word}</text>
	</svg>`
}
