# nodejs_lv3
내일배움캠프 nodejs lv3 개인과제

API 명세서
https://www.notion.so/8b4ed057903d4aca9b94c4c36ba6c138?v=05e44f744b91495ab8e566bb4b38c469&pvs=4

lv2의 readme에 문제였던 부분을 남겼는데 왜그런지 이해가 안가요.

그리고 lv2에서 낫던 오류는 여기선 안났어요. findOne 부분인데 왜 결과는 다르게 나오는 걸까요?

lv2에서 routes/posts.js 와  comments.js 부분에서 <br>
const post = await Posts.findOne({_id:postId}) 이렇게 findOne 부분과

lv3에서 routes/posts.js 와  comments.js 부분에서 <br>
const post = await Posts.findOne({where:{postId}}) 이 findOne 부분과
형식은 좀 다를지라도 같은 역할을 하는데 왜 위 부분은 없는 값이 들어가면 오류가나고, 아래 부분은 다른값이 들어가도 오류가 나지않고 변수에 값이 잘 들어가는 걸까요?
