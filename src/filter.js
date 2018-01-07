class Filter {

	static get TARGET_BASE() {
		return 32;
	}

	static get MAX_BITS() {
		return 28;
	}

	static get STR_LEN() {
		return Math.ceil(Filter.MAX_BITS/Math.log2(Filter.TARGET_BASE));
	}

	static parse(input) {
		const reg = new RegExp('[a-z0-9]{1,' + Filter.STR_LEN + '}', 'gi');
		let filters = input.match(reg).map((encoded) => parseInt(encoded, Filter.TARGET_BASE));
		return new Filter(filters);
	}

	static from(indices) {
		let max = Math.max.apply(null, indices) + 1;
		let filters = new Array(Math.ceil(max/Filter.MAX_BITS));
		filters.fill(0);
		indices.forEach(index => {
			let pos = Math.floor(index/Filter.MAX_BITS);
			let inc = 1 << (index%Filter.MAX_BITS);
			filters[pos] += inc;
		});
		return new Filter(filters);
	}

	constructor(filters) {
		this.filters = filters;
	}

	length() {
		let l = this.filters.length;
		return (l-1)*Filter.MAX_BITS + Math.ceil(Math.log2(this.filters[l-1]));
	}

	toString() {
		return this.filters
			.map(num => num.toString(Filter.TARGET_BASE))
			.join('');
	}

	test(index) {
		let filter = this.filters[Math.floor(index/Filter.MAX_BITS)];
		filter = (typeof filter === 'undefined') ? 0 : filter;
		let bin = (1 << (index%Filter.MAX_BITS)) & filter;
		return bin == 0;
	}

}

module.exports = Filter;