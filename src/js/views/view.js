import icons from '../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the Recived Object to the DOM
   * @param {Object | Object[]} data The data to be redered (e.g. recipe)
   * @param {Boolean} {render = true} if false, create markup string instead of rendering to the DOM
   * @returns {undefined| string} a markup string is returned if render = flase
   * @this {Object} view instance
   * @author Oktay Mozaffari
   * @todo finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currElements = Array.from(this._parentElement.querySelectorAll('*'));
    //console.log(currElements);
    //console.log(newElements);
    newElements.forEach((newEl, i) => {
      const curEL = currElements[i];
      //console.log(curEL, newEl.isEqualNode(curEL));

      //update changed Text
      if (
        !newEl.isEqualNode(curEL) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        //console.log('🔥', newEl.firstChild?.nodeValue.trim());
        curEL.textContent = newEl.textContent;
      }

      //update changed attributes
      if (!newEl.isEqualNode(curEL)) {
        //console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr =>
          curEL.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>;`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>;`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
