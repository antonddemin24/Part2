import axios from 'axios'
const baseUrl = 'api/persons'

const getAll = () => {
    const request = axios.get('http://localhost:3001/persons')
    return request.then(response => {
        return response.data
  })
}

const create = newObject => {
  const request = axios.post('http://localhost:3001/persons', newObject)
  return request
}

const deleteID = id => {
    const request =  axios.delete(`http://localhost:3001/persons/${id}`)
    return request
}

const update = (id, newObject) => {
  return axios.put(`http://localhost:3001/persons/${id}`, newObject)
}

export default { getAll, create, deleteID, update }