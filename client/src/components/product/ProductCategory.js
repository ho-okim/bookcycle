import React from 'react';

function ProductCategory(props) {

    const productList = ["전체보기", "문학", "철학", "종교", "사회과학", "자연과학", "기술과학", "예술", "언어", "역사", "인문/교양", "컴퓨터/모바일"]


    return (
        <div>
            <div className='column'>
                    <div className={`${style.category}`}>
                        <div className={`${style.box}`}>
                            <ul className='nav-bar'>
                                <Link to={''} style={{ textDecoration: "none", color: "black"}}>전체보기<br></br></Link>
                                <Link to={'/novel'} style={{ textDecoration: "none", color: "black"}}>소설<br></br></Link>
                                <Link to={'/literature'} style={{ textDecoration: "none", color: "black"}}>문학/인문<br></br></Link>
                                <Link to={'/history'} style={{ textDecoration: "none", color: "black"}}>역사/철학/심리/교육<br></br></Link>
                                <Link to={'/develop'} style={{ textDecoration: "none", color: "black"}}>자기계발</Link>
                            </ul>
                        </div>
                    </div>
                </div>
        </div>
    );
}

export default ProductCategory;