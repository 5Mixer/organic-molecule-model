const elements = [
	{ symbol: "C", possibleBonds: 4 },
	{ symbol: "H", possibleBonds: 1 }
]

function extendMolecule (molecule, constraint) {
	// console.log(constraint)
	// console.log()

	// Is this molecule incomplete?
	// if (molecule.getBondCount() < molecule.getElement().possibleBonds) {
	if (!molecule.isCompleteMolecule()) {
		var bondsToFill = molecule.getElement().possibleBonds - molecule.getBondCount()
		
		for (var i = 0; i < bondsToFill; i++) {
			// Only allow single bonds for now
			for (newAtomElement of elements) {
				if (constraint[newAtomElement.symbol] > 0) {
					
					// Create a new molecule with a bond using up a free element
					let newMolecule = molecule.clone()

					var newAtom = new Atom(newAtomElement.symbol)
					var backBond = new Bond(newMolecule, 1) // The bond back to this atom, from the new atom
					newAtom.bonds.push(backBond)

					var newBond = new Bond(newAtom, 1)
					newMolecule.bonds.push(newBond)

					var newConstraint = JSON.parse(JSON.stringify(constraint))
					newConstraint[newAtom.symbol]--
					
					// Problem: It should extend in the new atom, but it should also extend in other directions simulatenously
					extendMolecule(newAtom, newConstraint)
					extendMolecule(newMolecule, newConstraint)
					for (bond of newMolecule.bonds) {
						extendMolecule(bond.child, newConstraint)
					}
					
				}
			}
		}
	} else {
		// Molecule finished?
		if (molecule.isCompleteMolecule() && molecule.symbol != "H"){// && constraint["C"] == 0 && constraint["H"] == 0){

			if (completeMolecules.indexOf(molecule.flatten()) == -1 ){
				completeMolecules.push(molecule.flatten())
				console.log(`Complete molecule: ${molecule.flatten()}`)
			}
		}
	}
}
var completeMolecules = []

function Atom(symbol) {
	this.symbol = symbol	
	this.bonds = []
	return this
}
Atom.prototype.getElement = function () {
	for (element of elements)
		if (this.symbol == element.symbol)
			return element
}
Atom.prototype.getBondCount = function () {
	let occupiedBonds = 0
	for (bond of this.bonds)
		occupiedBonds += bond.number
	return occupiedBonds
}
var subscripts = "₀₁₂₃₄₅₆₇₈₉".split("")
Atom.prototype.flatten = function (excludeAtom,depth=1) {
	var formula = this.symbol + ""
	var childrenFormulas = []
	for (bond of this.bonds) {
		if (bond.child != excludeAtom){
			var f = bond.child.flatten(this,depth)
			childrenFormulas.push(f)
		}
	}

	// Search / group for duplicates in children nodes
	var childrenFormulasCounted = {}
	for (countedFormula of childrenFormulas) {
		if (Object.keys(childrenFormulasCounted).indexOf(countedFormula) != -1) {
			childrenFormulasCounted[countedFormula]++
		} else {
			childrenFormulasCounted[countedFormula] = 1
		}
	}

	var childFormulas = Object.keys(childrenFormulasCounted).reverse()
	for (child of childFormulas) {
		if (childrenFormulasCounted[child] > 1) {
			formula += "" + child + "" + subscripts[childrenFormulasCounted[child]]
		} else {
			for (var i = 0; i < childrenFormulasCounted[child]; i++)
				formula += child
		}
		
	}
	return formula
}
Atom.prototype.isCompleteMolecule = function (excludeAtom) {
	if (this.getBondCount() < this.getElement().possibleBonds)
		return false
	for (bond of this.bonds) {
		if (bond.child != excludeAtom)
			if (!bond.child.isCompleteMolecule(this))
				return false
	}
	return true
}

Atom.prototype.clone = function (excludes=[]) {
	var cloneMolecule = new Atom(this.symbol)
	excludes.push(this)
	for (bond of this.bonds) {
		if (excludes.indexOf(bond.child) == -1) {
			var childAtom = bond.child.clone(excludes)
			childAtom.bonds.push(new Bond(cloneMolecule, 1))
			cloneMolecule.bonds.push(new Bond(childAtom,1))
		}
	}
	return cloneMolecule
}

function Bond (child, number) {
	this.child = child
	this.number = number
	return this
}

var molecule = new Atom("C")

var constraint = { "C": 3, "H": 16, N: 1 }

extendMolecule (molecule, constraint)

