Vue.component('checkbox', {
	template: `<span
		role="checkbox"
		:aria-checked="value? 'true' : 'false'"
		@click="toggle"
		class="component--checkbox"
		:class="{ checked: value }">
	</span>`,

	props: {
		value: {
			type: Boolean,
			default: false
		}
	},

	methods: {
		toggle() {
			this.$emit('input', !this.value);
		}
	}
});