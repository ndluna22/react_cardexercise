import React, { useEffect, useState, useRef } from "react";
import Draw from "./Draw";
import axios from "axios";

const API_BASE_URL = "http://deckofcardsapi.com/api/deck";

/* Deck: uses deck API, allows drawing card at a time. */

function Deck() {
  const [deck, setDeck] = useState(null);
  const [drawn, setDrawn] = useState([]);

  /* At mount: load deck from API into state. */
  useEffect(() => {
    async function getData() {
      let d = await axios.get(`${API_BASE_URL}/new/shuffle/`);
      setDeck(d.data);
    }
    getData();
  }, [setDeck]);

  /* Draw a card via API, add card to state "drawn" list */
  async function getCard() {
    let { deck_id } = deck;

    try {
      let drawRes = await axios.get(`${API_BASE_URL}/${deck_id}/draw/`);

      if (drawRes.data.remaining === 0) {
        setAutoDraw(false);
        throw new Error("no cards remaining!");
      }

      const card = drawRes.data.cards[0];

      setDrawn((d) => [
        ...d,
        {
          id: card.code,
          name: card.suit + " " + card.value,
          image: card.image,
        },
      ]);
    } catch (err) {
      alert(err);
    }
  }

  const toggleAutoDraw = () => {
    setAutoDraw((auto) => !auto);
  };

  const cards = drawn.map((c) => (
    <Draw key={c.id} name={c.name} image={c.image} />
  ));

  return (
    <div>
      <button onClick={toggleAutoDraw}></button>

      <div>{cards}</div>
    </div>
  );
}

export default Deck;
