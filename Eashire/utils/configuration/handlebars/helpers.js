function compare(lvalue, rvalue, options) {
	if (arguments.length < 3) throw new Error("Handlerbars Helper 'compare' needs 2 parameters")

	const operator = options.hash.operator || '=='

	const operators = {
		'==': function (l, r) {
			return l == r
		},
		'===': function (l, r) {
			return l === r
		},
		'!=': function (l, r) {
			return l != r
		},
		'<': function (l, r) {
			return l < r
		},
		'>': function (l, r) {
			return l > r
		},
		'<=': function (l, r) {
			return l <= r
		},
		'>=': function (l, r) {
			return l >= r
		},
		typeof: function (l, r) {
			return typeof l == r
		},
	}

	if (!operators[operator])
		throw new Error(`Handlerbars Helper 'compare' doesn't know the operator ${operator}`)

	const result = operators[operator](lvalue, rvalue)

	if (result) {
		return options.fn(this)
	}
	if (typeof options.inverse == 'function') {
		return options.inverse(this)
	}
	return null
}

exports.getHelpers = () => {
	return {
		compare: compare,
	}
}
