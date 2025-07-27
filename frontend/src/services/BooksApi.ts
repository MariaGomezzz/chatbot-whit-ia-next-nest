export async function getAllMessages() {
  try {
    const response = await fetch("http://localhost:3000/books/conversation");

    /** El ppor qué de esta validación
     * fetch no lanza error con los estados http 
     * 
     * fetch lanza error cuando:
     *    - hay problemas en la red
     *    - problemas de CORS
     *    - URL malformada
     *    - servidor completamente inaccesible
     */

    //Valida q la respuesta no tenga un status 4xx o 5xx
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    /**
     * error en el momento es tipo unknow
     * por lo que se debe agreagar la validacion para que typescrip no moleste
     * 
     * Se valida si el error que se paso es de la instancia Error, esto
     * hace que typescript sepa que dentro del objeto si existe la pripiedad message
     */
    if (error instanceof Error) {
      throw new Error(`Error al obtener mensajes: ${error.message}`);
    }

    throw new Error('Error desconocido al obtener mensajes');
  }
}

export async function postRecommendation(body: any) {
  try {
    const response = await fetch("http://localhost:3000/books/conversation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al enviar mensaje: ${error.message}`);
    }
    throw new Error('Error desconocido al enviar mensajes');
  }
}
