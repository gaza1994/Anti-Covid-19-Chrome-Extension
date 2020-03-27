class AntiCovidSettings {
	public isDisabled: boolean;
	public postsRemovedCount: string;
	constructor() {
		this.getExtStatus()
		document
			.getElementById("toggleExt")
			.addEventListener("click", this.toggleExt);
			setInterval(() => {
				return this.getPostsRemovedCount();
			}, 1000)
	}

	private getExtStatus = () => {
		chrome.storage.sync.get(["isDisabled"], setings => {
			this.isDisabled = setings.isDisabled;
			document.getElementById("extStatus").innerHTML =
				this.isDisabled !== false ? "DISABLED" : "ENABLED";
		});
	}

	public toggleExt = (e: Event) => {
		chrome.storage.sync.set({
				isDisabled: !this.isDisabled
			},
			() => {
				this.isDisabled = !this.isDisabled;
				this.getExtStatus();
				console.log("Settings saved");
			}
		);
	};

	public getPostsRemovedCount = () => {
		chrome.storage.sync.get(["postsRemoved"], setings => {
			this.postsRemovedCount = setings.postsRemoved;
			document.getElementById("extPostCount").innerHTML = this.postsRemovedCount
		});

	}
}

const extensionSettings = new AntiCovidSettings();