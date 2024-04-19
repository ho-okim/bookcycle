



const product = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Root />} errorElement={<NotFound />}>
        <Route path="/" element={<Home />} />
        <Route path="/book/name" element={<Categories />} /> //상품사진
        <Route path="/name/:id" element={<Categories />} /> //상품제목
        <Route path="/info/:id" element={<ProductDetail />}> //상품 저자/출판사/출간일
          <Route path="/book/:id/" element={<Description />} /> //상품가격
          <Route path="/book/:id/recipe" element={<Recipe />} /> //닉네임
          <Route path="/book/:id/review" element={<Review />} /> //상세설명
        </Route>
      </Route>,
    ),
  );