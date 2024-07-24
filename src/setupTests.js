import '@testing-library/jest-dom'

// const observe = jest.fn();
// const unobserve = jest.fn();
// const disconnect = jest.fn();

// window.IntersectionObserver = jest.fn(function () {
//     this.observe = () => null;
//     this.unobserve = unobserve;
//     this.disconnect = disconnect;
// });

const mock = function () {
    return {
        observe: jest.fn(),
        disconnect: jest.fn(),
    };
};

//--> assign mock directly without jest.fn
window.IntersectionObserver = mock;