import React, { useEffect, useState } from 'react'
import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import personService from './services/persons'
import Notification from './components/Notification'
import ErrorMsg from './components/Error'


const App = () => {
  const [persons, setPersons] = useState([])

  useEffect(() => {
    personService
      .getAll()
      .then(initialNotes => {
        setPersons(initialNotes)
      })
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [ isAlertVisible, setIsAlertVisible ] = useState(false)
  const [ isErrortVisible, setIsErrorVisible ] = useState(false)

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault();

    const personExists = persons.some(person => person.name === newName)
    const person = persons.find(n => n.name === newName)

    if (personExists) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        const changedPerson = { ...person, number: newNumber }
        personService
          .update(person.id, changedPerson)
          .then(response => {
            setPersons(persons.map(person => person.name !== newName ? person : response.data))
          })
          .then(response => {setErrorMessage(`Changed ${changedPerson.name}`)
          setIsAlertVisible(true)
          setTimeout(() => {
              setIsAlertVisible(false);
          }, 3000);})
          .catch(error => {
            setIsErrorVisible(true)
            setErrorMessage(
              `Note '${changedPerson.name}' was already removed from server`
            )
            setTimeout(() => {
              setIsErrorVisible(false)
            }, 5000)
            setPersons(persons.filter(n => n.name !== newName))
          })
          setNewName('')
          setNewNumber('')
      } else {
        setNewName('')
        setNewNumber('')
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      };
      personService
        .create(personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
          setErrorMessage(`Added ${personObject.name}`)
          setIsAlertVisible(true)
          setTimeout(() => {
              setIsAlertVisible(false);
          }, 3000)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setIsErrorVisible(true)
            setErrorMessage(
              error.response.data.error
            )
            setTimeout(() => {
              setIsErrorVisible(false)
            }, 5000)
            setPersons(persons.filter(n => n.name !== newName))
        })
  }}

  const handleDelete = id => {
    personService
    .deleteID(id)
    .then(response => {
      setPersons(persons.filter(person => person.id !== id))
    })
  }

  const personsToShow = filter === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      {isAlertVisible&&
        <Notification message={errorMessage} />
      }

      {isErrortVisible&&
        <ErrorMsg message={errorMessage} />
      }

      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleSubmit={addPerson}
      />

      <h3>Numbers</h3>

      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App
