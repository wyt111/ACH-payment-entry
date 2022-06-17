<template>
  <div class="verifyCode-container">
      <div class="verifyCode_title">Please enter the verification code sent to your email.</div>
      <div class="security-code-wrap">
		<label for="code2">
			<ul class="security-code-container clear">
				<li class="field-wrap" v-for="(item, index) in number" :key="index">
					<i class="char-field">{{ value[index] || placeholder }}</i>
				</li>
			</ul>
		</label>
		<input
			ref="input"
			class="input-code"
			v-model="value"
			id="code2"
			name="code2"
			type="tel"
			:maxlength="number"
			autocorrect="off"
			autocomplete="off"
			autocapitalize="off"
		/>
	
	</div>
      <div class="verifyCode_title">Didn’t receive it? Resend code in 10s</div>
      <div class="verifyCode_title">I agree with Alchemy Pay's &lt;Terms of Service&gt; and &lt;Privacy Policy.&gt;</div>
      <div class="verifyCode_button">Continue
        <img src="@/assets/images/10008-icon.png" alt="">
      </div>
  </div>
</template>
<script>
  export default {
  name: "verifyCode",
  data(){
    return {
      number:6,
      value:'',
      placeholder:''
    }
  },
  watch: {
		value(val, oldV) {
			// this.$toast(val);
			this.$refs.input.value = val;
			this.value = val;
			if (this.value.length >= this.number) {
				this.hideKeyboard();
			}
			this.handleSubmit();
		},
	},
	methods: {
		hideKeyboard() {
			// 输入完成隐藏键盘
			document.activeElement.blur(); // ios隐藏键盘
			this.$refs.input.blur(); // android隐藏键盘
		},
		handleSubmit() {
			this.$emit("input", this.value);
		},
		handleInput(e) {
			this.$refs.input.value = this.value;
			if (this.value.length >= this.number) {
				this.hideKeyboard();
			}
			this.handleSubmit();
		},
		pasteInput(e) {
			this.$toast(this.value);
			console.log(this.value);
			// 当进行粘贴时
			e.clipboardData.items[0].getAsString((str) => {
				this.value = str.toString();
				console.log(e.clipboardData.items[0]);
				this.$toast(this.value);
				this.$refs.input.value = this.value;
				if (this.value.length >= this.number) {
					this.hideKeyboard();
				}

				this.handleSubmit();
			});
		},
	},

  }
</script>
<style lang="scss" scoped>
.verifyCode-container{
  width: 100%;
  height: 100%;
  overflow: hidden;
  .verifyCode_title{
    font-size: .13rem;
    color: #232323;
  }
  // .verifyCode_content{
  //   width: 100%;
  //   height: .8rem;
  //   display: flex;
  //   justify-content: space-between;
  //   align-items: center;
  //   span{
  //     display: inline-block;
  //     width: .5rem;
  //     height: .65rem;
  //     border-radius: .12rem;
  //     font-size: .24rem;
  //   }
  // }
  .security-code-wrap {
    height: .6rem;
	overflow: hidden;
}
.security-code-container {
  height: 100%;
	margin: 0;
	padding: 0;
	display: flex;
	// justify-content: center;
	justify-content: space-between;
	.field-wrap {
		text-align: center;
		list-style: none;
		display: block;
		// width: 2.3rem;
		// height: 2.5rem;
		line-height: 3rem;
		font-size: 1rem;
		background: #fff;
		border-bottom: 1px solid #888;
		// margin: 0.8rem;
		color: #000;
		.char-field {
			font-style: normal;
		}
	}
}
.input-code {
	position: absolute;
	left: -200%;
	top: -200%;
	opacity: 0;
	overflow: visible;
	z-index: -1;
}

}
</style>