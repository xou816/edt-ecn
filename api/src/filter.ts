export class Filter {

	static TARGET_BASE = 32;
	static MAX_BITS = 28;
	static STR_LEN = Math.ceil(Filter.MAX_BITS/Math.log2(Filter.TARGET_BASE));

	private filters: number[];

	static parse(input: string): Filter {
		let len = input.length;
		let strLen = Filter.STR_LEN;
		let count = Math.ceil(input.length/strLen);
		let diff = count*strLen-len;
		let filters = Array.from({length: count},
			(x, i) => input.slice(Math.max(0, (count-i-1)*strLen - diff), (count-i)*strLen - diff))
			.map(fragment => parseInt(fragment, Filter.TARGET_BASE));
		return new Filter(filters);
	}

	static from(indices: number[]): Filter {
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

	constructor(filters: number[]) {
		this.filters = filters;
	}

	length(): number {
		let l = this.filters.length;
		return (l-1)*Filter.MAX_BITS + Math.ceil(Math.log2(this.filters[l-1]));
	}

	toString(): string {
		return this.filters
			.slice()
			.reverse()
			.map((num, i) => num.toString(Filter.TARGET_BASE).padStart(i === 0 ? 0 : Filter.STR_LEN, "0"))
			.join('');
	}

	test(index: number): boolean {
		if (index > -1) {
            let filter = this.filters[Math.floor(index/Filter.MAX_BITS)];
            filter = filter == null ? 0 : filter;
            let bin = (1 << (index%Filter.MAX_BITS)) & filter;
            return bin === 0;
		} else {
			return false;
		}
	}

}