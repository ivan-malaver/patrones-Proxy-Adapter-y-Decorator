// src/comportamiento/observer/Subject.js

class Subject {
    constructor() {
        this.observers = [];
    }

    attach(observer) {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
            console.log(`🔗 Observer agregado. Total: ${this.observers.length}`);
        }
    }

    detach(observer) {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
            console.log(`🔗 Observer removido. Total: ${this.observers.length}`);
        }
    }

    notify(event, data = null) {
        console.log(`📢 Notificando a ${this.observers.length} observadores: ${event}`);
        
        this.observers.forEach(observer => {
            try {
                observer.update(this, { event, data });
            } catch (error) {
                console.error(`❌ Error notificando a observer:`, error);
            }
        });
    }

    getObserverCount() {
        return this.observers.length;
    }
}

export default Subject;