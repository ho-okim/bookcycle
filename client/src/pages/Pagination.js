import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/scss/pagination.module.scss";

function Pagination({ page, totalPosts, limit, setPage }) {
  const numPages = Math.ceil(totalPosts / limit);
  const [currPage, setCurrPage] = useState(page);
  let firstNum = currPage - (currPage % 5) + 1;
  let lastNum = currPage - (currPage % 5) + 5;
  //console.log({"currPage is":currPage, "firsNum is" : firstNum, "page is" : page})

  return (
    <PageSection>
      <ButtonWrap>
        <Button
          onClick={() => {
            setPage(page - 1);
            setCurrPage(page - 2);
          }}
          disabled={page === 1}
        >
          &lt;
        </Button>
        <Button
          onClick={() => setPage(firstNum)}
          aria-current={page === firstNum ? "page" : null}
        >
          {firstNum}
        </Button>
        {Array(4)
          .fill()
          .map((_, i) => {
            if (i <= 2) {
              return (
                <Button
                  border="true"
                  key={i + 1}
                  onClick={() => {
                    setPage(firstNum + 1 + i);
                  }}
                  aria-current={page === firstNum + 1 + i ? "page" : null}
                >
                  {firstNum + 1 + i}
                </Button>
              );
            } else if (i >= 3) {
              return (
                <Button
                  border="true"
                  key={i + 1}
                  onClick={() => setPage(lastNum)}
                  aria-current={page === lastNum ? "page" : null}
                >
                  {lastNum}
                </Button>
              );
            }
          })}
        <Button
          onClick={() => {
            setPage(page + 1);
            setCurrPage(page);
          }}
          disabled={page === numPages}
        >
          &gt;
        </Button>
      </ButtonWrap>
    </PageSection>
  );
}

export default Pagination;
