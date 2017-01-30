Vue.component('modal', {
	template: `<transition name="modal-transition">
		<div class="component--modal" v-if="visible">
			<div class="vue-modal-curtain" @click="clickOut"></div>
			<div class="vue-modal-window">
				<slot></slot>
			</div>
		</div>
	</transition>`,

	props: {
		visible: {
			type: Boolean,
			default: false
		}
	},

	methods: {
		clickOut() {
			this.visible && this.$emit('click-out');
		}
	},

	mounted() {
		this.$watch('visible', (visible) => this.$emit(visible ? 'show' : 'hide'));
	}
});