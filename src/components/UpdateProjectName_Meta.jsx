import { useState } from 'react';

function UpdateProjectName_Meta({ projectId, currentName, onClose, onNameUpdated }) {
  const [newName, setNewName] = useState(currentName || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim() || isSubmitting) return;

    setIsSubmitting(true);

    fetch('/update-project-name', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, newName: newName.trim() }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update project name');
        return res.json();
      })
      .then(() => {
        onNameUpdated(newName.trim());
        onClose();
      })
      .catch((err) => {
        console.error('Error updating project name:', err);
        alert('Could not update project name.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return { newName, setNewName, isSubmitting, handleSubmit };
}


export default UpdateProjectName_Meta;
