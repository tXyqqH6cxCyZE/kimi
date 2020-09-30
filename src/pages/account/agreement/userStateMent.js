import React, {Component} from 'react'
import {Modal, Button} from 'antd'

class UserStateMent extends Component {
	hideModel = () => {
		this.props.closeModel('userStateVisible')
	}
	render() {
		const {visible} = this.props
		return (<div>
			<Modal title={'用户声明'}
	               maskClosable={false} visible={visible} width={1000}                        
	               onCancel={this.hideModel}
	               footer={[
			            <Button key="close" onClick={this.hideModel}>
			              关闭
			            </Button>
			            
			       ]}
	               centered>
	        		<div className="agreement">
	        			<h2>用户声明 </h2>
						<p>欢迎访问粮票平台！对于您的隐私及权限，我们绝对尊重
							并予以保护，本用户声明将告诉您，粮票平台（所涉域名为：
							www.crdsjzx.com）收集与运用您的资料的方式以及我们的隐私
							保护政策。本站的用户声明正在不断改进中，随着我站服务范围的扩
							大，我们会不定期更新我们的用户声明内容。
						</p>
						<p>点击同意本《用户声明》视为您已阅读并同意本用户声明全部内
							容。本用户声明的全部条款属于《用户服务协议》的一部分，相关名
							词定义参照《用户服务协议》。
						
						</p>
						<h3>特别注意事项</h3>
						<p>您确认所获得的邀请链接是通过合法合规的方式取得，且该取得不存在对任何第三方的违约或侵权等情形</p> 
	                    <p>您在粮票平台（以下简称为“平台”）上的注册、信息录入、
							上传、修改、删除及确认、注销等操作行为代表公司，且您在平台上
							的操作已得到公司董事会或股东（大）会的授权且不违反适用于公司
							的法律、法规、政策和公司章程的规定；若您有违反企业章程和企业
							内部的其他规定而在平台进行操作，责任概由您负责，与平台无关。
						</p>
						<h3>邀请链接、用户名和密码</h3>
						<p>当您作为被指定联系人，获取平台发送的邀请链接，受公司（委
							托人）委托前来平台注册用户时，我们要求您设置委托人的平台登录
							用户名和密码。您可以通过该用户名和密码登录平台，并在委托人授
							权范围内进行后续操作。如果您丢失或泄露了上述邀请链接、用户名
							和密码，您可能丢失了委托人的识别信息，并且可能出现对您及您所
							代表的公司不利的后果。因此，无论任何原因危及上述邀请链接、用
							户名及密码安全，您应该立即通过平台公布的联系方式和我们取得联
							系，以便重置密码或重新发送邀请链接。
						</p>
						<h3>注册与认证</h3>
						<p>当您代表公司在平台完成注册，我们还会要求您代表公司提交
							公司身份认证信息和资料，包括：公司名称、公司证件类型、公司证
							件号、法人代表真实姓名、法人代表证件类型、法人代表证件号码、
							联系人真实姓名、联系人的证件类型、联系人的证件号码、联系人的
							手机号码等信息。另外，您还应上传上述证照的原件或加盖公章的复
							印件的照片或扫描件，以及法人代表对联系人注册和运营平台账户的
							授权委托书原件照片或扫描件，及联系人本人手持身份证的正面清晰
							照片，平台将在【1-3】个工作日内完成认证工作，并将认证结果展
							示在平台上予以通知。
						</p>
						<h3>用户行为</h3>
						<p>为了提供并优化您需要的服务，我们会根据合理性、必要性原
							则收集用户使用服务的相关信息，这类信息包括：在用户使用平台服
							务访问网页时，自动接收并记录用户浏览器和计算机上的信息，包括
							用户的IP地址、浏览器的类型、访问日期和时间、软硬件特征信息
							及用户需求的网页记录等数据；如您下载或使用平台客户端软件，或
							访问移动网页使用平台服务时，我们可能会读取与您位置和移动设备
							相关的信息，包括设备型号、设备识别码、操作系统、分辨率、电信
							运营商等。
						</p>
						<p>除上述信息外，我们还可能为了提供服务及改进服务质量的合理
							需要而收集用户的其他信息，包括用户与我们的客户服务团队联系时
							提供的相关信息，用户参与问卷调查时向我们发送的问卷答复信息。
							与此同时，为提高用户使用平台服务的安全性，更准确地预防钓鱼网
							站欺诈和木马病毒，我们可能会通过了解一些用户的网络使用习惯等
							手段来判断用户账户的风险。
						</p>
						<p>我们保证将采取严格的保密措施保护用户的信息不被泄露，并仅将所搜集的信息用于上述目的。</p>
						<h3>Cookie的使用</h3>
						<p>cookies 是少量的数据，在用户未拒绝接受 cookies 的情况下，
							cookies将被发送到用户的浏览器，并储存在用户的计算机硬盘中。我
							们使用 cookies 储存用户访问我们平台的相关数据，在用户访问或再
							次访问我们的平台时，我们能识别用户的身份，并通过分析数据为您
							提供更好更多的服务。
						</p>
						<p>用户有权选择接受或拒绝接受cookies。您可以通过修改浏览器的
							设置以拒绝接受 cookies，但是我们需要提醒您，因为您拒绝接受
							cookies，您可能无法使用依赖于cookies的我们网站的部分功能。
						</p>
						<h3>信息的披露和使用</h3>
						<p>我们不会向任何无关第三方提供、出售、出租、分享和交易用户
							信息，但为方便用户使用平台服务及平台关联公司或其他组织的服务
							（以下称“其他服务”），用户同意并授权平台将用户的信息传递给用
							户同时接受其他服务的平台关联公司或其他组织，或从为用户提供其
							他服务的平台关联公司或其他组织获取用户的信息，法律禁止的除
							外。如您及您的委托人不同意该等信息共享，您可向本公司发送书面
							声明，本公司将尊重您及您的委托人的意愿及选择。
						</p>
						<p>您同意我们可批露或使用您及（或）您的公司的用户信息以用于
							识别和（或）确认您的身份，或解决争议，或有助于确保网站安全、
							限制欺诈、非法或其他刑事犯罪活动，以执行我们的服务协议。
						</p>
						<p>您同意我们可批露或使用您及（或）您的公司的用户信息以保护
						您的生命、财产之安全或为防止严重侵害他人之合法权益或为公共利
						益之需要。</p>
						<p>您同意我们可批露或使用您及（或）您的公司的用户信息以改进
						我们的服务，并使我们的服务更能符合您的要求，从而使您在使用我
						们服务时得到更好的用户体验。
						</p>
						<p>您同意我们利用您及（或）您的公司的用户信息与您联络，并向
						您提供您感兴趣的信息，如：服务到期提醒。
						</p>
						<p>当我们被法律强制或依照政府因识别涉嫌侵权行为人的要求而
						提供您的信息时，我们将善意地披露您的资料。
						</p>
						<h3>信息的存储和交换</h3>
						<p>所收集的用户信息和资料将加密保存在平台及（或）其关联公司的服务器上。</p>
						<h3>外部链接</h3>
						<p>平台可能含有到其他网站的链接。我们对那些网站的隐私保护措
						施不负任何责任。我们可能在任何需要的时候增加商业伙伴或共用品
						牌的网站。
						</p>
						<h3>安全</h3>
						<p>我们平台有相应的安全措施来确保我们掌握的信息不丢失，不被
						滥用和篡改。这些安全措施包括向其它服务器备份数据和对用户信息
						加密。尽管我们有这些安全措施，但请注意，在因特网上不存在“绝
						对安全的安全措施”。
						</p>
						<h3>修改您的资料</h3>
						<p>您可以在平台上修改或者更新您的登录密码、电话号码、地址和
						电子邮件地址（在成功登录之后）。若需变更公司名称、法人代表、
						联系人、交易密码时，我们需要您重新提交相应的证明文件的照片或
						扫描件，和授权委托书原件的照片或扫描件，及新的联系人本人手持
						身份证的正面清晰照片。
						</p>
						<h3>联系我们</h3>
						<p>如果您对本隐私声明或平台的隐私保护措施以及您在使用时有
						任何意见和建议，欢迎通过平台公布的联系方式向我们反馈意见。
						</p>
						<h3>法律声明</h3>
						<p>若要访问和使用平台服务，您必须不加修改地完全接受本用户声
						明中所包含的条款、条件和平台即时刊登的通告，并且遵守有关互联
						网及/或本平台的相关法律、规定与规则。一旦您及您的委托人使用
						平台服务，即表示您及您的委托人同意并接受了所有该等条款、条件
						及通告。
						</p>
						<h3>版权和商标</h3>
						<p>平台所有的版权权利均在全世界范围内受到法律保护，除非有其
							他的标注或在此等条款和规则中被允许使用，本网站上可阅读和可见
							的所有资料都受到知识产权法的保护。
						</p>
						<p>平台拥有的所有版权和商标未经书面同意，不得以任何非法手段
							侵犯。对于已经授权的版权或者商标用途，只能使用于授权时指定的
							范围。任何人不得利用工作之便获取版权和商标。
						</p>
						<h3>保密条款</h3>
						<p>任何人均需严格遵守安全保密条款，保护各方商业秘密及相关权
							益，包括但不限于产品知识产权、策划方案、客户资料、协议合同、
							技术文档、程序文件、程序控件或源代码、各种账户密码。任何人不
							得泄漏他人的任何商业秘密，同时不得利用工作之便获取他人技术秘
							密。对于授权使用的技术，只能使用于授权时指定的范围，不得用于
							它途。
						</p>
						
				</div>
	        </Modal>
		</div>)
	}
}
export default UserStateMent