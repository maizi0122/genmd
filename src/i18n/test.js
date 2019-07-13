let data = {
key:'键',
value:'值',
description:'描述',
action: 'Action',
request:'请求体',
request_post_payload:'请求体',
request_string_params:'查询参数',
response:'响应',
send:'发送',
sending:'发送中...',
input_id: '请输入用户的ID',
btn_add_header: '请求头',
btn_reset:'重置数据',
btn_tutorial:'演示', 
btn_cors:'跨域',
btn_build_md:'生成Markdown',
btn_add_description:'填充描述',
btn_delete:'删除',
btn_back_top:'返回顶端',
voide_tutorial:'视频教程',
no_data:'暂无内容',
title_build_md: '生成Markdown文档',
th_req_url: '接口地址',
th_req_type: '接口类型',
th_req_template: '入参模板',
th_req_description: '入参介绍',
th_res_template:'出参模板',
th_res_description:'出参介绍',
data_type_string: '字符串',
data_type_int: '整型',
data_type_float: '浮点数',
data_type_boolean: '布尔值',
data_type_array: '数组/列表',
data_type_object: '对象',

}
let result = `キー
値
説明
アクション
請求体
請求体
クエリーのパラメータ
応答
送信
送信中..
ユーザIDを入力してください
請求先
データをリセット
プレゼンテーション
国境をまたぐ
Markdownを生成
説明を塗りつぶす
削除
トップに戻る
動画リスト
内容はまだない
Markdown文書を生成
インターフェースアドレス
インターフェースの種類
テンプレート
参加のご案内
テンプレート
出参案内
文字列
型をととのえる
浮動小数点
ブール値
配列/リスト
オブジェクト`
let resultSet = result.split('\n');
console.log(resultSet)

let newObj = {}
let keys = Object.keys(data);
for(let i = 0;i<keys.length;i++ ){
    newObj[keys[i]] = resultSet[i]
}
console.log(newObj)