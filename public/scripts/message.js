const closeBtns = document.querySelectorAll('.delete');

closeBtns.forEach(button => {
	button.addEventListener('click', () => {
		const messages = document.querySelectorAll('.notification');

		messages.forEach(msg => {
			msg.classList.add('hidden');
		});
	});
});