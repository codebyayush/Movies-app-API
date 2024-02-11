import React, { useState } from "react";
import "./Form.css";

const Form = (props) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const uniqueKey = Math.random();

  function titleOnChange(e) {
    setTitle(e.target.value);
  }

  function textOnChange(e) {
    setText(e.target.value);
  }

  function dateOnChange(e) {
    setDate(e.target.value);
  }

  const onClickHandler = () => {
    const newMovie = {
      key: uniqueKey,
      id: uniqueKey,
      title: title,
      openingText: text,
      releaseDate: date,
    };

    props.newObj(newMovie);

    setTitle("");
    setText("");
    setDate("");
  };

  return (
    <React.Fragment>
      <div className="form">
        <label for="title-text">Title</label>
        <input
          className="title-text"
          type="text"
          value={title}
          onChange={titleOnChange}
        />
        <br />

        <label for="opening-text">Opening Text</label>
        <textarea
          className="opening-text"
          type="textarea"
          rows="4"
          cols="50"
          value={text}
          onChange={textOnChange}
        />
        <br />

        <label for="date">Release Date</label>
        <input
          type="date"
          className="date"
          value={date}
          onChange={dateOnChange}
        />
        <br />
        <br />
        <button onClick={onClickHandler}>Add Movie</button>
      </div>
    </React.Fragment>
  );
};

export default Form;
