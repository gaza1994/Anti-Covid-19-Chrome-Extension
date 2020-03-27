class AntiCovid {
	private isDisabled: boolean
	private postsRemovedSession = 0
	public defaultWords: string[] = [
		'COVID 19',
		'COVID19',
		'COVID-19',
		'CORONA',
		'CORONAVIRUS',
		'CORONA VIRUS',
		'QUARATINE',
		'SOCIAL DISTANCING',
		'LOCK DOWN',
		'LOCKDOWN',
		'pandemic',
		'Isolation',
		'isolated',
		'virus'
	]

	constructor() {
		chrome.storage.sync.get(['isDisabled'], setings => {
			this.isDisabled = setings.isDisabled

			chrome.storage.onChanged.addListener((changes: any, namespace) => {
				if (changes.isDisabled) {
					this.isDisabled = changes.isDisabled.newValue
				}
			})

			MutationObserver = window.MutationObserver
			const domObserver = new MutationObserver((domChanges: any, obs: any) => {
				if (this.isDisabled) return true

				domChanges.forEach((x) => {
					if (
						x.target.id.includes('story_id') ||
						x.target.tagName === 'ARTICLE'
					) {

						if (this.getWords().test(x.target.innerText.toUpperCase())) {
							x.target.remove()
							this.updatePostRemoveCount()
						}
					}
				})
			})

			if (
				window.location.host === 'facebook.com' ||
				window.location.host === 'www.facebook.com' ||
				window.location.host === 'twitter.com' ||
				window.location.host === 'www.twitter.com'
			) {
				domObserver.observe(document, {
					subtree: true,
					attributes: true
				})
			}
		})
	}

	private getWords = () => {
		const words = this.defaultWords.join('|')
		words.replace(' ', ' ')
		words.replace('-', '-')
		words.toUpperCase()
		return new RegExp(words, 'g')
	}

	private updatePostRemoveCount = () => {
		this.postsRemovedSession++
		setTimeout(() => {
			chrome.storage.sync.set({
					postsRemoved: this.postsRemovedSession
				},
				() => {}
			)
		}, 1000)
	}
}

const extension = new AntiCovid()