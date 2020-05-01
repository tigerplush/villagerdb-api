import React from "react";

/**
 *
 */
export default class Paginator extends React.Component {
    /**
     *
     * @param props
     */
    constructor(props) {
        super(props);

        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
    }

    /**
     *
     * @returns {*}
     */
    render() {
        // No results case.
        if (this.props.totalCount < 1) {
            return null;
        }

        // Compute previous and next page links.
        let previousPageLink;
        if (this.props.currentPage === 1) {
            previousPageLink = (
                <li className="page-item disabled">
                    <a className="page-link" href="#browser" tabIndex="-1">Previous page</a>
                </li>
            );
        } else {
            previousPageLink = (
                <li className="page-item">
                    <a className="page-link" href="#browser"
                       onClick={this.previousPage}
                       tabIndex="-1">
                        Previous page
                    </a>
                </li>
            );
        }

        let nextPageLink;
        if (this.props.currentPage === this.props.totalPages) {
            nextPageLink = (
                <li className="page-item disabled">
                    <a className="page-link" href="#browser">
                        Next page
                    </a>
                </li>
            );
        } else {
            nextPageLink = (
                <li className="page-item">
                    <a className="page-link" href="#browser"
                        onClick={this.nextPage}>Next page</a>
                </li>
            );
        }
        return (
            <div className="text-right">
                <p>Results {this.props.startIndex} - {this.props.endIndex} of {this.props.totalCount}</p>
                <nav aria-label="page navigation">
                    <ul className="pagination justify-content-end">
                        {previousPageLink}
                        {nextPageLink}
                    </ul>
                </nav>
            </div>
        );
    }

    previousPage(e) {
        if (this.props.currentPage > 1) {
            this.props.onPageChange(this.props.currentPage - 1);
        }
    }

    nextPage(e) {
        if (this.props.currentPage < this.props.totalPages) {
            this.props.onPageChange(this.props.currentPage + 1);
        }
    }
}
