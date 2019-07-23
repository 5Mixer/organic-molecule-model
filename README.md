# organic-molecule-model
A small project to explore the data representation and exploration of organic chemical molecules. A little brute force.

Every atom can extend with a certain number of bonds. C can have 4 bonds, H 1, etc. Every atom stores a link whose child is an atom that the original atom is bonded to.
For example, a C atom may have a maximum of 4 of these links. Each link child may then have other bonds, as well as a bond that links back to the original atom.
To brute force generate such molecules, this tree is continuously explored, subtracting from a starting 'empirical formula' array to determine which elements may still be added to the molecule and preventing infinite brute force.
It's currently difficult to determine if two atoms are part of the same molecule given this tree structure. There is no 'root' node.
