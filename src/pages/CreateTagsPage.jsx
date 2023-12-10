import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { tripsRef, tagsRef } from "../config/Firebase";

export const CreateTagsPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const tripId = params.tripId;

  const [tags, setTags] = useState([]);
  const [chosenTags, setChosenTags] = useState([]);

  useEffect(() => {
    onSnapshot(tagsRef, (data) => {
      const tagsData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTags(tagsData);
    });
  }, []);

  function handleTagClick(name) {
    if (chosenTags.includes(name)) {
      // If present, remove it from the array
      setChosenTags((prevTags) => prevTags.filter((tag) => tag !== name));
    } else {
      // If not present, add it to the array
      setChosenTags((prevTags) => [...prevTags, name]);
    }
  }

  async function saveTrip(event) {
    event.preventDefault();
    const docRef = doc(tripsRef, tripId);

    // Update the trip with the chosenTags array
    await updateDoc(docRef, {
      tags: chosenTags,
    });
    navigate("/");
  }

  return (
    <section>
      <form onSubmit={saveTrip}>
        <h1>Choose tags</h1>
        {tags.map((tag) => (
          <div onClick={() => handleTagClick(tag.name)} key={tag.id}>
            <p>{tag.name}</p>
            <img src={tag.picture} alt="" />
          </div>
        ))}
        <button type="submit">Next</button>
      </form>
    </section>
  );
};
