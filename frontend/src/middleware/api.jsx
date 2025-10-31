
export const startStream = async (API_BASE, file = null) => {
  let res;
  
  if (file) {
    const formData = new FormData();
    formData.append("file", file);

    res = await fetch(`${API_BASE}/start`, {
      method: "POST",
      body: formData,
    });
  } else {
    res = await fetch(`${API_BASE}/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ video: null }),
    });
  }

  const result = await res.json();
  if (!res.ok) {
    throw new Error(`Failed to start stream: ${res.statusText}`);
  }

  return { result, ok: res.ok };
};




export const stopStream = async (API_BASE) => {
  const res = await fetch(`${API_BASE}/stop`, { method: "POST" });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(`Failed to stop stream: ${res.statusText}`);
  }
  return {result, ok: res.ok};
};
