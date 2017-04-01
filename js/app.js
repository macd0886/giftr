"use strict";
class app {
    constructor() {
        this.app = {
            key: "giftr-macd0886",
            currentContact: -1,
            currentGift: -1,
        };
        this.cancelGift = this.cancelGift.bind(this);
        this.cancelPerson = this.cancelPerson.bind(this);
        this.saveGift = this.saveGift.bind(this);
        this.savePerson = this.savePerson.bind(this);
        this.data = false;
        document.addEventListener('DOMContentLoaded', () => {
            this.getProfiles();
            document.querySelector("#addUser").addEventListener("touchstart", () => {
                this.app.currentContact = -1;
                this.createUserModel();
            });
        });
        window.addEventListener('push', ev => {
            let content = ev.currentTarget.document.querySelector(".table-view");
            let id = content.id;
            if (id === "contact-list") {
                document.querySelector("#addUser").addEventListener("touchstart", () => {
                    this.app.currentContact = -1;
                    this.createUserModel();
                });
                this.DisplayUserList();
            } else if (id === "gift-list") {
                this.DisplayGiftList();
            }
        });
    }

    getProfiles() {
        if (localStorage.getItem(this.app.key)) {
            this.data = JSON.parse(localStorage.getItem(this.app.key));
            console.dir(this.data);
        } else {
            this.data = {
                people: [
                    {
                        id: 827381263882763,
                        name: "bobette",
                        bday: "1987-03-12",
                        ideas: [
                            {
                                idea: "Gerome",
                                at: "LCBO",
                                cost: "",
                                url: "http://lcbo.com/",
                            }
                            , {
                                idea: "Watch",
                                at: "Tommy hilfiger",
                                cost: "2000.00",
                                url: "",
                            }
                        ]
                    },
                    {
                        id: 19283719282833,
                        name: "Jacob",
                        bday: "1997-08-15",
                        ideas: [
                            {
                                idea: "popcorn",
                                at: "bulkbarn",
                                cost: "20.00",
                                url: "",
                            }
                        ],
                    },
                ],
            };
            localStorage.setItem(this.app.key, JSON.stringify(this.data));
        }
        this.DisplayUserList();
    }

    createUserModel() {
        let inputName = document.getElementById("inputName");
        let inputDate = document.getElementById("inputDate");
        let modal = document.getElementById("personModal");
        if (this.app.currentContact < 0) {
            modal.querySelector(".title").innerHTML = "Person Add";
            inputDate.value = "";
            inputName.value = "";
        }
        else {
            modal.querySelector(".title").innerHTML = "Person Edit";
            inputDate.value = this.data.people[this.app.currentContact].bday;
            inputName.value = this.data.people[this.app.currentContact].name;
        }
        let buttons = modal.getElementsByTagName("button");
        let saveBtn = buttons[1];
        let cancelBtn = buttons[0];
        cancelBtn.addEventListener("touchstart", this.cancelPerson);
        saveBtn.addEventListener("touchstart", this.savePerson);
    }

    createGiftModel() {
        let modal = document.getElementById("giftModal");
        let inputIdea = document.getElementById("inputIdea");
        let inputStore = document.getElementById("inputStore");
        let inputURL = document.getElementById("inputURL");
        let inputCost = document.getElementById("inputCost");
        modal.getElementsByTagName('p')[0].innerHTML = this.data.people[this.app.currentContact].name;
        if (this.app.currentGift < 0) {
            modal.querySelector(".title").innerHTML = "Gift Add";
            inputCost.value = "";
            inputIdea.value = "";
            inputURL.value = "";
            inputStore.value = "";
        }
        else {
            modal.querySelector(".title").innerHTML = "Gift Edit";
            let idea = this.data.people[this.app.currentContact].ideas[this.app.currentGift];
            inputCost.value = idea.cost;
            inputIdea.value = idea.idea;
            inputURL.value = idea.url;
            inputStore.value = idea.at;
        }
        let buttons = modal.getElementsByTagName("button");
        let saveBtn = buttons[1];
        let cancelBtn = buttons[0];
        cancelBtn.addEventListener("touchstart", this.cancelGift);
        saveBtn.addEventListener("touchstart", this.saveGift);
    }

    cancelPerson() {
        this.removePersonListeners();
        let modal = document.getElementById("personModal");
        let inputName = document.getElementById("inputName");
        let inputDate = document.getElementById("inputDate");
        inputDate.value = "";
        inputName.value = "";
        this.app.currentContact = -1;
        modal.classList.toggle("active");
    }

    cancelGift() {
        this.removeGiftListeners();
        let modal = document.getElementById("giftModal");
        let inputIdea = document.getElementById("inputIdea");
        let inputStore = document.getElementById("inputStore");
        let inputURL = document.getElementById("inputURL");
        let inputCost = document.getElementById("inputCost");
        inputCost.value = "";
        inputIdea.value = "";
        inputURL.value = "";
        inputStore.value = "";
        this.app.currentGift = -1;
        modal.classList.toggle("active");
    }

    savePerson() {
        this.removePersonListeners();
        let modal = document.getElementById("personModal");
        let inputDate = document.getElementById("inputDate");
        let inputName = document.getElementById("inputName");
        if (this.app.currentContact < 0) {
            this.data.people.push({
                name: inputName.value,
                bday: inputDate.value,
                id: Date.now(),
                ideas: [],
            });
        } else {
            let person = this.data.people[this.app.currentContact];
            person.name = inputName.value;
            person.bday = inputDate.value;
        }
        this.app.currentContact = -1;
        inputDate.value = "";
        inputName.value = "";
        this.DisplayUserList();
        modal.classList.toggle("active");
        this.saveData();
    }

    saveGift() {
        this.removeGiftListeners();
        let modal = document.getElementById("giftModal");
        let inputURL = document.getElementById("inputURL");
        let inputCost = document.getElementById("inputCost");
        let inputIdea = document.getElementById("inputIdea");
        let inputStore = document.getElementById("inputStore");
        if (this.app.currentGift < 0) {
            this.data.people[this.app.currentContact].ideas.push({
                idea: inputIdea.value,
                cost: inputCost.value,
                at: inputStore.value,
                url: inputURL.value,
            });
        } else {
            let idea = this.data.people[this.app.currentContact].ideas[this.app.currentGift];
            idea.cost = inputCost.value;
            idea.url = inputURL.value;
            idea.idea = inputIdea.value;
            idea.at = inputStore.value;
        }
        this.app.currentGift = -1;
        this.DisplayGiftList();
        modal.classList.toggle("active");
        this.saveData();
    }

    removePersonListeners() {
        let modal = document.getElementById("personModal");
        let cancelBtn = modal.getElementsByTagName("button")[0];
        cancelBtn.removeEventListener("touchstart", this.cancelPerson);
        let saveBtn = modal.getElementsByTagName("button")[1];
        saveBtn.removeEventListener("touchstart", this.savePerson);
    }

    removeGiftListeners() {
        let modal = document.getElementById("giftModal");
        let cancelBtn = modal.getElementsByTagName("button")[0];
        cancelBtn.removeEventListener("touchstart", this.cancelGift);
        let saveBtn = modal.getElementsByTagName("button")[1];
        saveBtn.removeEventListener("touchstart", this.saveGift);

    }

    saveData() {
        localStorage.removeItem(this.app.key);
        localStorage.setItem(this.app.key, JSON.stringify(this.data));
        this.data = JSON.parse(localStorage.getItem(this.app.key));
    }

    DisplayUserList() {
        let ul = document.getElementById("contact-list");
        ul.innerHTML = "";
        this.data.people.forEach((element, index) => {
            let displayDate = moment(element.bday);
            let li = document.createElement("li");
            let a = document.createElement('a');
            let a2 = document.createElement('a');
            let span = document.createElement('span');
            let span2 = document.createElement('span');
            li.className += "table-view-cell";
            span.className += "name";
            a.href = "#personModal";
            a.setAttribute("data-id", index.toString());
            a.innerHTML = element.name;
            a.addEventListener("touchstart", () => {
                this.app.currentContact = index;
                this.createUserModel();
            });
            span.appendChild(a);
            a2.className += "navigate-right pull-right";
            a2.href = "gifts.html";
            a2.setAttribute("data-id", index.toString());
            a2.addEventListener("touchstart", () => {
                this.app.currentContact = index;
            });
            span2.className += "bday";
            span2.innerHTML = displayDate.format("MMM do");
            li.appendChild(span);
            a2.appendChild(span2);
            li.appendChild(a2);
            ul.appendChild(li);
        });
    }

    DisplayGiftList() {
        document.querySelector("#newGift").addEventListener("touchstart", () => {
            this.app.currentGift = -1;
            this.createGiftModel();
        });
        let ul = document.getElementById("gift-list");
        ul.innerHTML = "";
        let ideas = this.data.people[this.app.currentContact].ideas;
        ideas.forEach((item, index) => {
            let li = document.createElement("li");
            let p = document.createElement('p');
            let pc = document.createElement('p');
            let a = document.createElement('a');
            let span = document.createElement('span');
            let div = document.createElement('div');
            li.className += "table-view-cell media";
            span.className = "pull-right icon icon-trash midline";
            span.addEventListener("touchstart", () => {
                ideas.splice(index, 1);
                localStorage.removeItem(this.app.key);
                localStorage.setItem(this.app.key, JSON.stringify(this.data));
                this.DisplayGiftList();
            });
            div.className += "media-body";
            div.innerHTML += item.idea;
            div.addEventListener("touchstart", () => {
                this.app.currentGift = index;
                document.getElementById("giftModal").classList.toggle("active");
                this.createGiftModel();
            });
            p.appendChild(a);
            pc.innerHTML = item.cost;
            a.href = item.url;
            a.target = "_blank";
            a.innerHTML = item.at;
            div.appendChild(p);
            div.appendChild(pc);
            li.appendChild(span);
            li.appendChild(div);
            ul.appendChild(li);
        });

    }
}
new app();