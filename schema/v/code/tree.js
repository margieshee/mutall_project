// 
//Resolve the popup class used by the browser popup window 
import * as outlook from "../../../outlook/v/code/outlook.js";
// 
//Export all the classes in this module 
export { node, branch, leaf };
//
//Modelling branches and leaves as nodes
class node {
    //
    //The parent of this node, which must be a branch or null
    parent;
    //
    //Unique name for identifying this node. 
    name;
    // 
    //The full name of this node 
    path;
    // 
    //The collection of all the nodes that are members 
    //of this tree 
    static members = new Map();
    //
    constructor(name, parent) {
        //
        //Save the properies of this node
        this.parent = parent;
        //
        //Every node has a name
        this.name = name;
        //
        //The id of this node comprises of two parts 
        //full name of the parend and the name of this node 
        //
        //The full name of the parent is either its path or the 
        //root folder  
        const parent_path = this.parent === null ? "" : this.parent.path;
        // 
        //Set the full name of this node.
        this.path = parent_path + "/" + this.name;
        //
        //Save this node in the collection indexed by its full name.
        node.members.set(this.path, this);
    }
    //
    //Create a node, given the static version.
    static create(Inode, parent) {
        //
        //Activate a branch
        if (Inode.class_name === "branch") {
            //
            //This must be a branch. Create one and return
            return new branch(Inode, parent);
        }
        //
        //The node must be a leaf, create it
        return new leaf(Inode, parent);
    }
    //
    //Highlights the selected node on the navigation panel and updates the content
    // panel (depending on the node type)
    select(elem) {
        //
        //0. Ensure the selection was done from the navigation panel
        //
        const nav = document.querySelector('#nav');
        //
        //1. Highlight the selected element
        //
        //1.1 Remove whatever was selected before, assuming that there can be only 1 selection
        //
        if (nav === null)
            throw Error('Navigation panel not found');
        //
        //Get the current selected element
        const selection = nav.querySelector('.selected');
        //
        //Remove the selection, if any
        if (selection !== null)
            selection.classList.remove('selected');
        //
        //1.2 Select the given element
        elem.classList.add('selected');
        //
        //2. Update the content panel, dependig on the node type.
        this.show_content_panel();
    }
}
//Modelling a branch as a node that has children.
class branch extends node {
    //
    //The icon filename to be used for  representing all branches
    icon = "Normal.ico";
    //
    //The children of this branch
    children;
    //
    //Use a static node to construct a branch (object)
    constructor(Inode, parent) {
        //
        //Initialze the parent constructor
        super(Inode.name, parent);
        //
        //Start populating the children prperty
        //
        //There must be a chidren property in the static node
        //
        //Get the children node
        const children = Inode.children;
        //
        if (children === undefined)
            throw new Error('This node is not a branch');
        //
        //Go through each child and convert it to a node
        this.children = children.map(child => node.create(child, this));
    }
    //
    //Toggling is about opening the branch children (if they are closed) or closing
    //them if they are open.
    toggle(name) {
        //
        //Get the children node.
        const children_node = this.get_child_node(name);
        //
        //Establish if the children node is open
        const children_is_open = !children_node.hidden;
        //
        //Test if the children branch is open..
        if (children_is_open) {
            //
            //...close the branch
            //
            //Hide the children node
            children_node.hidden = true;
        }
        else {
            //The children branch is closed. Open it.
            //
            //Unhide the children node
            children_node.hidden = false;
        }
    }
    //Returns the named child html element of this branch
    get_child_node(name) {
        //
            ??  ??  ??  ?
            :
        ;
        const parent = document.querySelector(name);
        //
        if (parent === null)
            throw new Error(`Node named ${name} cannot be found`);
        //
        const child_node = parent.querySelector('.children');
        if (child_node === null)
            throw new Error('Child node not found');
        //
        return child_node;
    }
    //Returns the html of branch
    get_html() {
        //
        const branch_html = `

                <div id="${this.path}" class="folder">
                    <div class="header">
                        <button  
                            onclick="branch.toggle('${this.name}')"
                            class="btn">+</button>
                        <div onclick="node.select(this)>
                            <img src="images/${this.icon}"/>
                            <span>${this.name}</span>
                        </div>
                    </div>
                    <div class="children hide">
                        ${this.get_children_html()}
                    </div>
                </div>
               `;
        return branch_html;
    }
    //
    //Convert this branch to a html element
    get_element() {
        //
        const Branch = this.
        ;
    }
    //
    //Get the html of the children as a string representation for display in a dom
    get_children_html() {
        //
        //begin with an empty string for the children
        let html = "";
        //
        //loop through all the children adding their html to this string
        for (const child of this.children) {
            //
            //adding the html by string concatenation
            const child_ = child.get_html();
            html += child_;
        }
        //
        //return the combined string
        return html;
    }
}
//A leaf is a node that has no children
class leaf extends node {
    constructor(Inode, parent) {
        //
        super(Inode.name, parent);
    }
    //The htl code for a leaf
    get_html() {
        return `
            <div id="${this.name}" class="file container" onclick="node.select(this)>
                <span>${this.name}</span>
            </div>
            `;
    }
}
// 
//A popoup quiz page for browsing the servers directory.
export class browser extends outlook.popup {
    target;
    Inode;
    initial;
    //
    //The selected full name is saved here for future 
    //access to return the browser result of this popup
    //It is set when we check the user input 
    full_name;
    // 
    constructor(
    // 
    //The target represents the type of the path to return
    //from this popup.
    target, 
    // 
    //This is the browser template  
    url, 
    // 
    //The static partialy enriched node 
    Inode, 
    //
    //This path defines those folders that will be enriched with  
    //children
    initial) {
        super(url);
        this.target = target;
        this.Inode = Inode;
        this.initial = initial;
        // 
        //The two pannel
    }
    // 
    //Ensure that a user has selected a file or path. 
    async check() {
        //
        //Get the selected node
        const selected_div = this.document.querySelector(".selected");
        //
        //Reject this promise if no node is currently selected
        if (selected_div === undefined) {
            // 
            //Alert the user 
            alert(`Please select a ${this.target}`);
            // 
            //Fail gracefully 
            return false;
        }
        //
        //Get the corresponding node 
        const selected_node = node.members.get(selected_div.id);
        //Get its full name 
        this.full_name = selected_node.path;
        // 
        //A successful selection
        return true;
    }
    // 
    //Return the selected full name. 
    async get_result() {
        return this.full_name;
    }
    // 
    //Show the pannels of this browser.
    async show_panels() {
        // 
        //Show the naviation panel 
        //
        //Create the node from the static structure 
        const Node = node.create(this.Inode, null);
        // 
        //Get the html of the node 
        const html = Node.get_html();
        // 
        //Get the target element where to put the html
        const nav = this.get_element("nav");
        // 
        //Change the inner html 
        nav.innerHTML = html;
        // 
        //Open the initial path on the navigation panel and return the node to 
        //select on the navigation tree. 
        const path_node = this.open_initial_path();
        // 
        //
        // 
        //Select the initial path.
        //(hopefully this paints the content panel)
        Node.show_content_panel();
    }
    // 
    //Unhide the children of the rich folders(branches). 
    open_initial_path() {
        // 
        // Opening an initial path is valid only when 
        //when are one.
        if (this.initial === undefined)
            return null;
        // 
        //Get the initial (logical) node.
        const path_node = node.members.get(this.initial);
        //
        // Initialize the while loop.
        let Node = path_node;
        //
        //Loop through all the rich folders using this 
        //initial path and unhide their children.
        while (Node !== null) {
            // 
            //Test whether this node is a branch
            if (Node instanceof branch) {
                // 
                //Unhided this node's children.
                // 
                //Get the children html element. Its an immediate child of the 
                //the element identified by this node's path.
                const element = this.document
                    .querySelector(`#${Node.path}>.children`);
                // 
                //Unhide the element.
                element.classList.remove("hide");
            }
            // 
            //Update the looping node to its parent
            Node = Node.parent;
        }
        //
        return path_node;
    }
}
