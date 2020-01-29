package com.mining.web;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.View;

import com.cleopatra.protocol.data.DataRequest;
import com.cleopatra.protocol.data.ParameterGroup;
import com.cleopatra.spring.JSONDataView;
import com.mining.crawling.GetComment;
import com.mining.crawling.TopActor;
import com.mining.crawling.TopBoxoffice;
import com.mining.crawling.TopMovie;
import com.mining.dao.DbDao;

@Controller
@RequestMapping("/dtctl")
public class DataController {

	//
	@Autowired
	private DbDao dbdao;

	@Autowired
	private GetComment gct;

	@Autowired
	private TopMovie tmv;
	
	@Autowired
	private TopActor tar;
	
	public DataController() {
	}

	@RequestMapping("/getRank.do")
	public View getRank(HttpServletRequest request, HttpServletResponse response, DataRequest dataRequest)
			throws IOException {
		// 영화 순위 top 10 가져오기
		List<Map<String, Object>> getRank = tmv.getRank();
		dataRequest.setResponse("dsRank", getRank);
		
		//영화인 , 티켓 예매율 top 5 가져오기
		List<Map<String, Object>> getActor = tar.getRank();
		List<Map<String,Object>> listAct = new ArrayList<>();
		List<Map<String,Object>> listTicket = new ArrayList<>();
		for(int k=0; k<5; k++){
			Map<String,Object> act = new HashMap<>();
			act.putAll(getActor.get(k));
			listAct.add(act);
		}
		for(int k=5; k<10; k++){
			Map<String,Object> ticket = new HashMap<>();
			ticket.putAll(getActor.get(k));
			listTicket.add(ticket);
		}
		dataRequest.setResponse("dsActor", listAct);
		dataRequest.setResponse("dsTicket", listTicket);
		
//		List<Map<String, Object>> getBox = tbo.getRank();
//		dataRequest.setResponse("dsBox", getBox);

		return new JSONDataView();
	}

	@RequestMapping("/getComment.do")
	public View getComment(HttpServletRequest request, HttpServletResponse response, DataRequest dataRequest)
			throws IOException {
		System.out.println("크롤링 시작");

		// 콤보박스에서 입력한 값을 code로 받아서 GetComment로 크롤링 하는 작업
		ParameterGroup param = dataRequest.getParameterGroup("dmComment");
		String code = (param.getValue("code"));
		//Map<String, Object> getAlc = new HashMap<>();
		
		Map<String,Object> tranAlc = new HashMap<>();
		List<Map<String, Object>> getAlc = new ArrayList<>();
		if (!"".equals(code) && code != null) { // 코드가 널값이면 실행하지않게끔
			tranAlc = gct.CrawlingComment(code); //
		}
		
		getAlc = (List<Map<String, Object>>) tranAlc.get("getCommentResult");//dbQuery용 리스트로 태그표 기준 
																			//기준에 부합한 데이터만 가지고온다.
		List<Map<String, Object>> alcCount = new ArrayList<>();
		alcCount = (List<Map<String, Object>>) tranAlc.get("listCount"); //count용 리스트로 명사,동사만 가지고온다.

		List<Map<String,Object>> count = gct.CountWords(alcCount); //크롤링한댓글들 중 명사,동사의 빈도수 체크하기
		
		// 크롤링한 댓글 의 긍부정 판단과 키워드 담고있는 객체 
		Map<String, Object> getDao = dbdao.getJudge(getAlc);
		dataRequest.setResponse("dsCount", count);
		
		//최종 긍부정 판단1.0이면 긍정 , -1이면 부정,그외에 중립 판정
		Map<String, Object> getJudge = (Map<String, Object>) getDao.get("resultJudge");
		Set<String> keySet = getJudge.keySet();
		Iterator<String> it = keySet.iterator();
		int good = 0, bad = 0, center = 0;
		double avg =0.0;

		while (it.hasNext()) {// 긍부정 판정을 내린 데이터들을 최종 적으로 분류해서 객체에 담아줌.
								// 7점을 기준으로 이상이면 긍정문 이하이면 부정문 판정
			String key = it.next();
			String valueS = getJudge.get(key).toString();
			double value = Double.parseDouble(valueS); 
			if (value > 7.0) {
				good++;
				avg += value;
			} else if (value < 7.0) {
				bad++;
				avg += value;
			} else {
				center++;
				avg += value;
			}
		}
		int sum = good + bad + center ;
		avg = avg/sum;
		System.out.println("총평점은  : " + avg);
		List<Map<String, Object>> judge = new ArrayList<>();
		Map<String, Object> data = new HashMap<>();
		data.put("good", good);
		data.put("bad", bad);
		data.put("center", center);
		judge.add(data);
		dataRequest.setResponse("dsJudge", judge);

		return new JSONDataView();
	}

}
