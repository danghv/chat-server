// Initializes the `messages` service on path `/messages`
const createService = require('feathers-nedb');
const createModel = require('../../models/messages.model');
const hooks = require('./messages.hooks')

class Messages {
  constructor() {
    this.messages = []
    this.currentId = 0
  }

  async find() {
    return this.messages
  }

  async get(id, params) {
    const message = this.messages.find(message => message.id === parseInt(id, 10))
    if (!message) {
      throw new Error(`Message with id ${id} not found`)
    }
    return message
  }

  async create(data, params) {
    const message = Object.assign({
      id: ++this.currentId
    }, data)

    this.messages.push(message)

    return message
  }

  async patch(id, data, params) {
    const message = await this.get(id)
    
    return Object.assign(message, data)
  }

  async remove(id, params) {
    const message = await this.get(id)
    const index = this.messages.indexOf(message)

    this.messages.splice(index, 1)

    return message
  }
  
}

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  // app.use('/messages', createService(options));
  app.use('/messages', new Messages())

  // Get our initialized service so that we can register hooks
  const service = app.service('messages');

  service.hooks(hooks);
};
