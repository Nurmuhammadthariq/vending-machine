class MachineVending {
  constructor() {
    this.money = 0;
  }

  loadFood(...args) {
    console.log(args);
    args.forEach((arg) => {
      this[arg.name] = [arg];
    });
  }

  countFood() {
    // count all stok food
    const self = Object.keys(this);
    let count = 0;
    self.forEach((item) => {
      const food = this[item][0];
      if (food) {
        count += Number(food.stok);
      }
    });
    return count;
  }

  addMoney(stok = 0) {
    this.money += stok;
    this.updateDom();
  }

  reduceMoney(amount = 0) {
    const newAmount = this.money - Number(amount);
    this.money = newAmount;
    this.updateDom();
  }

  purchase(selection) {
    console.log(selection)
    const self = Object.keys(this);
    self.forEach((item) => {
      const food = this[item][0];
      if (food?.code === selection && this.money >= food.price) {
        if (food.stok > 0) {
          this.reduceMoney(food.price);
          this.updateIndividualfoodCount(food)
        } else {
          alert(`${food.name} out of stock`);
        }
      }
    });
  }

  updateDom() {
    const self = Object.keys(this);
    const totalFoods = this.countFood();
    const productCounter = document.getElementById("productCount");
    const pay = document.getElementById("pay");
    const display = document.getElementById("displayBox");
    const displayItems = document.querySelectorAll(".displayItem");

    const text = `${totalFoods} Foods`;
    productCounter.innerHTML = text;
    pay.innerHTML = `Rp. ${this.money}`;

    if (display.childElementCount === 0) {
      self.forEach((item) => {
        const food = this[item][0];
        if (food) {
          const element = document.createElement("div");
          const name = food.name;
          const stok = food.stok;
          element.classList.add("displayItem");
          element.innerHTML = `${name} (${stok})`;
          display.append(element);
        }
      });
    } else {
      self.forEach((item, idx) => {
        const food = this[item][0];
        if (food) {
          const name = food.name;
          const stok = food.stok;
          displayItems[idx - 1].innerHTML = `${name} (${stok})`;
        }
      });
    }
  }

  updateIndividualfoodCount(item) {
    // update the soda count purchased
    item.stok--;
    this.updateDom();
  }

  onTurn() {
    this.updateDom();
  }

  addListeners(nodeList) {
    nodeList &&
      nodeList.forEach((node) => {
        switch (node.classList.value) {
          case "selection":
            node.addEventListener("click", () => {
              this.purchase(node.value);
            });
            break;
          case "money":
            node.addEventListener("click", () => {
              let stok = Number(node.value);
              this.addMoney(stok);
            });
            break;
          default:
            break;
        }
      });
  }
}

class Item {
  constructor(name, stok, price, code) {
    this.name = name;
    this.stok = stok;
    this.price = price;
    this.code = code;
  }
}

const biskuit = new Item("Biskuit", "5", "6000", "A1");
const chips = new Item("Chips", "5", "8000", "A2");
const oreo = new Item("Oreo", "8", "10000", "A3");
const tango = new Item("Tango", "5", "12000", "A4");
const cokelat = new Item("Cokelat", "5", "15000", "A5");

const machineVending = new MachineVending();
machineVending.addListeners(document.querySelectorAll(".selection"));
machineVending.addListeners(document.querySelectorAll(".money"));
machineVending.loadFood(biskuit, chips, oreo, tango, cokelat);
machineVending.countFood();
machineVending.onTurn();
