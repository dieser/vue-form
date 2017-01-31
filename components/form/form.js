Vue.component('v-form', {
	template:
		`<div class="form__container">
			<form action="https://formspree.io/dalejchapman@gmail.com" method="post">
				<h1>{{ form.title }}</h1>
				<p>{{ form.desc }}</p>
				<label class="label">
					<input type="text" name="name" required>
					<div class="form__text">
						name
					</div>
				</label>
				<label class="label">
					<input type="email" name="_replyto" value="" required>
					<div class="form__text">
						email
					</div>
				</label>
				<button @click(submit) type="submit" name="Send">Submit</button>
			</form>
		</div>`,
	data: function () {
		return {
			form: {
				title: "Form",
				desc: "A simple template for a submit form",
				send: "dalejchapman@gmail.com"
			}
		}
	},

	methods: {
		submit() {
			console.log("okeh");
		}
	}
});
