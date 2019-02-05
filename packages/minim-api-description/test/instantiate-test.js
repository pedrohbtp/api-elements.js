const { expect } = require('chai');
const minim = require('minim');
const apiDescription = require('../lib/api-description');

const namespace = minim.namespace().use(apiDescription);

const StringElement = namespace.elements.String;
const ArrayElement = namespace.elements.Array;

describe('instantiate StringElement', () => {
  it('returns content', () => {
    const element = new StringElement('hello');
    const value = element.instantiate();

    expect(value).to.deep.equal(['hello', 'content']);
  });

  it('prefers content over default and samples', () => {
    const element = new StringElement('hello');
    element.attributes.set('default', new StringElement('moin'));
    element.attributes.set('samples', new ArrayElement(
      new StringElement('zdravicko')
    ));
    const value = element.instantiate();

    expect(value).to.deep.equal(['hello', 'content']);
  });

  it('prefers a sample over a default', () => {
    const element = new StringElement();
    element.attributes.set('default', new StringElement('moin'));
    element.attributes.set('samples', new ArrayElement([
      new StringElement('zdravicko'),
    ]));
    const value = element.instantiate();

    expect(value).to.deep.equal(['zdravicko', 'sample']);
  });

  it('prefers default over generating a value', () => {
    const element = new StringElement();
    element.attributes.set('default', new StringElement('moin'));
    const value = element.instantiate();

    expect(value).to.deep.equal(['moin', 'default']);
  });

  it('generates an empty string if no content, default, samples and not nullable', () => {
    const element = new StringElement();
    const value = element.instantiate();

    expect(value).to.deep.equal(['', 'generated']);
  });

  it('generates null if no content, default, samples and nullable', () => {
    const element = new StringElement();
    element.attributes.set('typeAttributes', new ArrayElement([
      new StringElement('nullable'),
    ]));
    const value = element.instantiate();

    expect(value).to.deep.equal([null, 'content']);
  });
});
