import React from 'react'

const Persons = ({ personsToShow, handleDelete }) => {
  //console.log(personsToShow)
  return (
    <div>
      {personsToShow.map(person => (
        <p key={person.id}>
          {person.name} {person.number}
          <button onClick={() => handleDelete(person.id)}>delete</button>
        </p>
      ))}
    </div>
    )
  }

  export default Persons