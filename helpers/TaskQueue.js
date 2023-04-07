class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class Queue {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  enqueue(value) {
    if (!this.head) {
      this.head = new Node(value);
      this.tail = this.head;
    } else {
      const previous = this.tail;
      const node = new Node(value);
      previous.next = node;
      this.tail = node;
    }

    this.size++;
  }

  dequeue() {
    const item = this.head;
    this.head = this.head.next;
    this.size--;
    return item.value;
  }
}

class TaskQueue {
  constructor() {
    this.queue = new Queue();
    this.hasStarted = false;
  }

  add(executor) {
    return new Promise((resolve) => {
      const wrapper = (value) => {
        resolve(value);
        this.begin();
      };

      this.queue.enqueue(() => executor(wrapper));

      if (!this.hasStarted) {
        this.hasStarted = true;
        this.begin();
      }
    });
  }

  begin() {
    if (!this.queue.size) {
      this.hasStarted = false;
      return;
    }

    const executeTask = async () => {
      const currentTask = this.queue.dequeue();
      currentTask();
    };

    executeTask();
  }
}

module.exports = TaskQueue;
